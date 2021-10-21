import axios from 'axios';
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken';

interface IAccessTokenResponse {
  access_token: string
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const { data: accessTokenResponse } =
      await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          "Accept": "application/json"
        }
      });

    const response = await axios.get<IUserResponse>("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    });

    const {
      id,
      login,
      avatar_url,
      name,
      followers,
      following,
      html_url,
      location,
      public_repos
    } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        git_id: id
      }
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          git_id: id,
          login,
          avatar_url,
          name,
          followers,
          following,
          html_url,
          location,
          public_repos,
        }
      });
    };

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id
        }
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    )

    return { token, user };
  }
}

export { AuthenticateUserService };
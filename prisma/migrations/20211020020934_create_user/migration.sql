-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "git_id" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "public_repos" INTEGER NOT NULL,
    "followers" INTEGER NOT NULL,
    "following" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "html_url" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL
);

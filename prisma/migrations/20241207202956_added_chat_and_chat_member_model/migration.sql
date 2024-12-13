-- CreateTable
CREATE TABLE "Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "last_message_time" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Chat_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chat_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    CONSTRAINT "Chat_Member_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chat_Member_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_Member_chat_id_member_id_key" ON "Chat_Member"("chat_id", "member_id");

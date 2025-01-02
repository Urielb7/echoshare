import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bookmark, Home, Puzzle } from "lucide-react"; // Import de l'icône Puzzle
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      {/* Home Section */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {/* Notifications Section */}
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />

      {/* Messages Section */}
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />

      {/* Bookmarks Section */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>

      {/* Matching Section */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Matching"
        asChild
      >
        <Link href="/matching">
          <Puzzle /> {/* Icône du morceau de puzzle */}
          <span className="hidden lg:inline">Matching</span>
        </Link>
      </Button>
    </div>
  );
}

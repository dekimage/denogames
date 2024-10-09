"use client";
import { observer } from "mobx-react";
import { useState } from "react";
import { Bell, Check, CheckCheck, Settings, Trash } from "lucide-react";
import Link from "next/link";
import MobxStore from "@/mobx";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef } from "react";
import { useEffect } from "react";

const SettingIcon = observer(({ notification }) => {
  const { markAsRead, deleteNotification, user } = MobxStore;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative border-none" variant="outline" size="icon">
          <Settings />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!notification.isRead && (
          <DropdownMenuItem
            onClick={() => markAsRead(user.uid, notification.id)}
          >
            Mark as read
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => deleteNotification(user.uid, notification.id)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

const NotificationCard = observer(({ notification }) => {
  return (
    <div className="border relative flex my-4">
      {!notification.isRead && (
        <div className="rounded-full w-[16px] h-[16px] bg-red-600 absolute top-[-5px] right-[-5px]"></div>
      )}
      <Link
        href={notification.link}
        passHref
        className={`block ${
          !notification.isRead ? "text-black" : "text-gray-500"
        }`}
      >
        <div className="flex flex-col justify-between border-r  p-2 hover:bg-gray-100">
          <div className="text-md">{notification.title}</div>
          <p className="text-xs">{notification.message}</p>
        </div>
      </Link>
      <div className="flex items-center space-x-2">
        <SettingIcon notification={notification} />
      </div>
    </div>
  );
});

const NotificationDropdown = observer(() => {
  const { notifications } = MobxStore;
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("unread");

  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") {
      return !notification.isRead;
    }
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={handleToggleDropdown}
        className="relative"
        size="icon"
        variant="reverse"
      >
        <Bell />
        {notifications.filter((n) => !n.isRead).length > 0 && (
          <span className="absolute top-[-5px] right-[-5px] z-50 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs font-bold">
            {notifications.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Notifications</h3>
            <Tabs defaultValue="unread">
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                  onClick={() => setFilter("all")}
                >
                  All
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {filteredNotifications.length === 0 ? (
              <div className="h-[120px] flex justify-center items-center border mt-4">
                <div>No new notifications</div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    notification={notification}
                    key={notification.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default NotificationDropdown;

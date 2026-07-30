import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getReminderStatus } from "../utils/calculations";

export const useReminderNotifications = ({ reminders, currentUser, t }) => {
  const [permission, setPermission] = useState(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission
  );

  useEffect(() => {
    if (!currentUser || !reminders.length) return;

    const urgent = reminders.filter((reminder) => {
      const status = getReminderStatus(reminder);
      return status === "dueToday" || status === "overdue";
    });
    if (!urgent.length) return;

    const dateKey = new Date().toISOString().split("T")[0];
    const storageKey = `expense-tracker-reminder-notified-${currentUser.id}-${dateKey}`;
    const notifiedIds = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    const fresh = urgent.filter((item) => !notifiedIds.has(item.id));
    if (!fresh.length) return;

    toast.error(t("toast.reminderAlert", { count: fresh.length }), { duration: 5500 });

    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      fresh.slice(0, 3).forEach((reminder) => {
        new Notification(t("notifications.paymentReminder"), {
          body: `${reminder.title} · ${reminder.nextDate}`,
          tag: `expense-reminder-${reminder.id}`,
        });
      });
    }

    localStorage.setItem(storageKey, JSON.stringify([...notifiedIds, ...fresh.map((item) => item.id)]));
  }, [reminders, currentUser, t]);

  const requestPermission = async () => {
    if (typeof Notification === "undefined") {
      setPermission("unsupported");
      toast.error(t("notifications.unsupported"));
      return "unsupported";
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") toast.success(t("notifications.enabled"));
    else toast.error(t("notifications.denied"));
    return result;
  };

  return { permission, requestPermission };
};

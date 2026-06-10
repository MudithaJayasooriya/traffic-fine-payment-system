import Navbar from "../components/Navbar";
import { notifications } from "../data/mockNotifications";

function Notifications() {
  return (
    <div className="min-h-screen text-[#eaf6ff]">

      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">

        <h1 className="mb-8 text-3xl font-bold">
          Notifications
        </h1>

        <div className="space-y-4">

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-3xl border p-5 shadow-lg ${
                notification.read
                  ? "border-[#113a5a] bg-[#08243c]"
                  : "border-blue-500/40 bg-blue-500/10"
              }`}
            >
              <div className="flex items-center justify-between">

                <h2 className="text-lg font-semibold">
                  {notification.title}
                </h2>

                {!notification.read && (
                  <span className="rounded-full bg-green-500 px-3 py-1 text-xs">
                    New
                  </span>
                )}

              </div>

              <p className="mt-2 text-[#cfeeff]">
                {notification.message}
              </p>

              <p className="mt-3 text-xs text-[#8db8d8]">
                {notification.date}
              </p>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}

export default Notifications;
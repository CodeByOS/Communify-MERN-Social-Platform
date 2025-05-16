import { Bell } from 'lucide-react'

const NoNotifactionsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="size-20 rounded-full bg-base-300 flex items-center justify-center shadow-sm mb-6">
        <Bell className="size-10 text-base-content opacity-50" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        No Notifications Yet
      </h3>
      <p className="text-base text-gray-600 dark:text-gray-400 max-w-md">
        There’s nothing new right now. Incoming friend requests and messages will be displayed here.
      </p>
    </div>
  )
}

export default NoNotifactionsFound
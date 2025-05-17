
const NoFriendsFound = () => {
    return (
        <div className="card bg-base-200 p-6 sm:p-8 rounded-xl shadow-lg max-w-xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                You haven’t added any friends yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                Connect with language learners below to start practicing through real conversations.
            </p>
        </div>
    );
};

export default NoFriendsFound;

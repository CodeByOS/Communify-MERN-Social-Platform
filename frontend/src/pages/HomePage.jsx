import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getOutgoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from "../lib/api";

import { Link } from "react-router";
import { CheckCircle, CircleCheckBig, MapPin, UserPlus, Users } from "lucide-react";
import NoFriendsFound from "../components/NoFriendsFound";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";

const HomePage = () => {
  const queryClient = useQueryClient();

  // State to track which friend requests have already been sent
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  // Fetch the current user's friends
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // Fetch recommended users for potential friend connections
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  // Fetch IDs of users who have received a friend request from the current user
  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  // Mutation to send a friend request
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      // Refresh outgoing friend requests after sending a new one
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  // Populate the set of outgoing request IDs when the data is fetched
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Utility to capitalize the first letter of a string
  const capitialize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-12 bg-base-100 min-h-screen">
      <div className="container mx-auto space-y-12 max-w-7xl">
        {/* Friends Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Your Friends
          </h2>
          <Link
            to="/notifications"
            className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white focus:ring-4 focus:ring-primary/40 transition rounded-md px-4 py-2 text-sm font-semibold"
          >
            <Users className="size-4" />
            Friend Requests
          </Link>
        </div>

        {/* Friends List / Loading / Empty State */}
        {loadingFriends ? (
          // Show loading spinner while friends are being fetched
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-xl" />
          </div>
        ) : friends.length === 0 ? (
          // Show message if the user has no friends yet
          <NoFriendsFound />
        ) : (
          // Display list of friend cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Recommended Users Section */}
        <section>
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                  Meet New Learners
                </h2>
                <p className="mt-1 max-w-md text-gray-600 dark:text-gray-400">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {/* Loading / No Recommendations / User Cards */}
          {loadingUsers ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-xl" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-3 text-gray-800 dark:text-gray-200">
                No recommendations available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedUsers.map((user) => {
                // Check if a request was already sent to this user
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="card-body p-6 space-y-5">
                      {/* User Profile Info */}
                      <div className="flex items-center gap-4">
                        <div className="avatar size-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <MapPin className="size-4 mr-1 text-primary" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Language Badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-secondary px-3 py-1.5 text-sm font-semibold">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline px-3 py-1.5 text-sm font-semibold">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {/* User Bio */}
                      {user.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {user.bio}
                        </p>
                      )}

                      {/* Send Friend Request Button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircle className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlus className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage
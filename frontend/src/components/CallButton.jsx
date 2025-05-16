import { Video } from "lucide-react";

function CallButton({ handleVideoCall }) {
    return (
        <div className="fixed top-4 right-4 z-50">
            <button
                onClick={handleVideoCall}
                className="btn btn-success text-white shadow-lg rounded-full p-3 hover:scale-105 active:scale-95 transition-transform duration-200"
                title="Start Video Call"
            >
                <Video className="size-5" />
            </button>
        </div>
    );
}

export default CallButton;

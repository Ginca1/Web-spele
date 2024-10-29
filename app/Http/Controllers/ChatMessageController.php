<?php


namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatMessageController extends Controller
{
    public function index($roomId)
    {
        return ChatMessage::where('room_id', $roomId)
            ->with('user:id,name')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function store(Request $request, $roomId)
    {
        $message = ChatMessage::create([
            'room_id' => $roomId,
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        return response()->json([
            'message' => $message->message,
            'user' => $message->user->name,
            'timestamp' => $message->created_at->format('H:i'),
        ]);
    }
}


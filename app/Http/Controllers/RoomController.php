<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class RoomController extends Controller
{


    
    public function store(Request $request)
    {
       
        $request->validate([
            'theme' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'privacy' => 'required|in:public,private',
        ]);

       
        $room = new Room();
        $room->user_id = Auth::id(); 
        $room->theme = $request->theme;
        $room->region = $request->region;
        $room->privacy = $request->privacy;
        $room->max_players = 2; 
        $room->current_players = 1;  
        $room->status = 'open'; 

       
        do {
            $room_code = Str::random(8);
        } while (Room::where('room_code', $room_code)->exists()); 

        $room->room_code = $room_code; 

        
        $room->save();

      
        return response()->json([
            'message' => 'Room created successfully!',
            'room_code' => $room_code, 
        ], 201);
    }



    public function show($room_code)
    {
        $room = Room::where('room_code', $room_code)->firstOrFail();
        return inertia('UserRoom', ['room' => $room]);
        // Return the room details as a JSON response
        // return response()->json([
        //     'room_code' => $room->room_code,
        //     'theme' => $room->theme,
        //     'region' => $room->region,
        //     'current_players' => $room->current_players,
        //     'max_players' => $room->max_players,
        //     'privacy' => $room->privacy,
        //     'status' => $room->status,
        // ]);
    }
}

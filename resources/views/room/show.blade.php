@extends('layouts.app')

@section('content')
<div class="room-lobby">
    <h1>Welcome to Room: {{ $room->room_code }}</h1>
    <p>Theme: {{ $room->theme }}</p>
    <p>Region: {{ $room->region }}</p>
    <p>Players: {{ $room->current_players }}/{{ $room->max_players }}</p>
    
    <div>
        <h3>Invite your friends!</h3>
        <p>Share this link: <a href="{{ url('/rooms/' . $room->room_code) }}">{{ url('/rooms/' . $room->room_code) }}</a></p>
    </div>

    <!-- Display success message if available -->
    @if(session('message'))
        <div class="alert alert-success">
            {{ session('message') }}
        </div>
    @endif

    <!-- Additional functionalities can be added here -->
</div>
@endsection

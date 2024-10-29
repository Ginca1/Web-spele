<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id(); // Primary key ID
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Creator of the room
            $table->string('theme'); // Theme of the room
            $table->string('region'); // Region or server location
            $table->enum('privacy', ['public', 'private']); // Privacy setting for the room
            $table->integer('max_players')->default(2); // Maximum number of players allowed
            $table->integer('current_players')->default(0); // Number of players currently in the room
            $table->enum('status', ['open', 'in-game', 'closed'])->default('open'); // Room status
            $table->timestamps(); // created_at and updated_at fields
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rooms');
    }
}


<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('game_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Game type (europe, asia, etc.)
            $table->string('game_type', 50);
            
            // Game statistics
            $table->integer('countries_completed');
            $table->integer('total_countries');
            $table->integer('time_played'); // in seconds
            $table->integer('perfect_guesses');
            $table->integer('hints_used');
            $table->integer('skips_used');
            $table->integer('flags_used');
            $table->decimal('score', 8, 2);
            
            // Completi
            $table->timestamp('completed_at');
            
            // Additional metrics
            $table->integer('correct_guesses');
            $table->integer('incorrect_guesses');
            $table->json('failed_countries')->nullable();
            $table->json('semi_correct_countries')->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('game_type');
            $table->index('completed_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('game_results');
    }
};
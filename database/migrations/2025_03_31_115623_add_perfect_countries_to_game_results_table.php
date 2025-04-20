<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('game_results', function (Blueprint $table) {
            $table->json('perfect_countries')->nullable()->after('semi_correct_countries');
        });
    }
    
    public function down()
    {
        Schema::table('game_results', function (Blueprint $table) {
            $table->dropColumn('perfect_countries');
        });
    }
};

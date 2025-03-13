<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add the `level` column with a default value of 1
            $table->unsignedInteger('level')->default(1);

            // Add the `xp` column with a default value of 0
            $table->unsignedInteger('xp')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the `level` and `xp` columns if the migration is rolled back
            $table->dropColumn('level');
            $table->dropColumn('xp');
        });
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('coins')->default(2000)->after('remember_token');
            $table->unsignedBigInteger('picture_id')->nullable()->after('coins');
            // Add the foreign key constraint
            $table->foreign('picture_id')->references('id')->on('picture')->onDelete('cascade');   
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['picture_id']); // Drop the foreign key constraint
            $table->dropColumn('coins'); // Drop the coins column
            $table->dropColumn('picture_id'); // Drop the picture_id column
        });
    }
}

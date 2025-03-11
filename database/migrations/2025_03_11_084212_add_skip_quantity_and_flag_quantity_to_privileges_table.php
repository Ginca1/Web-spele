<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSkipQuantityAndFlagQuantityToPrivilegesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('privileges', function (Blueprint $table) {
            // Add skip_quantity column with a default value of 0
            $table->integer('skip_quantity')->default(0);

            // Add flag_quantity column with a default value of 0
            $table->integer('flag_quantity')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('privileges', function (Blueprint $table) {
            // Drop the skip_quantity column
            $table->dropColumn('skip_quantity');

            // Drop the flag_quantity column
            $table->dropColumn('flag_quantity');
        });
    }
}
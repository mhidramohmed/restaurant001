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
        DB::statement("ALTER TABLE orders CHANGE payment_status payment_status ENUM('paid', 'unpaid', 'faild') DEFAULT 'unpaid'");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
                DB::statement("ALTER TABLE orders CHANGE payment_status payment_status ENUM('paid', 'unpaid') DEFAULT 'unpaid'");

    }
};

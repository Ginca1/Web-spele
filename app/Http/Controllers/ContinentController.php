<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ContinentController extends Controller
{
    public function europe()
    {
        return Inertia::render('Continent/Europe'); // Renders the europel
    }

    public function americas()
    {
        return Inertia::render('Continent/Americas'); // Renders the americasdc
    }

    public function asia()
    {
        return Inertia::render('Continent/Asia'); // Renders the asia
    }

    public function africa()
    {
        return Inertia::render('Continent/Africa'); // Renders the africa
    }
}
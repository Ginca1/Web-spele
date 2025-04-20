<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ContinentController extends Controller
{
    public function europe()
    {
        return Inertia::render('Continent/Europe'); // Renders the europel
    }

    public function america()
    {
        return Inertia::render('Continent/America'); // Renders the americasdc
    }

    public function asia()
    {
        return Inertia::render('Continent/Asia'); // Renders the asia
    }

    public function africa()
    {
        return Inertia::render('Continent/Africa'); // Renders the africa
    }

    public function all()
    {
        return Inertia::render('Continent/All'); // Renders the africa
    }
}
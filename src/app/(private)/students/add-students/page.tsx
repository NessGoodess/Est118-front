"use client";
import React from "react";
import GenericHeader from "@/components/ui/GenericHeader";

export default function AddStudents() {
    return (
        <section className="m-4 sm:m-6 lg:m-10 mx-auto">
            <GenericHeader
                title="Formulario de Inscripción"
                description="Complete la siguiente información con veracidad. Los campos marcados con (*) son obligatorios."
                icon="register"
            />
        </section>
    );
}
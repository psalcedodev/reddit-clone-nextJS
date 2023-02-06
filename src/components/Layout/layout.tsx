import React from "react";
import Navbar from "../Navbar/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            {/* <Footer /> */}
        </>
    );
}

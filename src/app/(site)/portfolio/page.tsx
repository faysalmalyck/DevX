import React from "react";
import Portfolio from "@/components/portfolio/PortfolioList";
import HeroSub from "@/components/shared/HeroSub";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Portfolio",
    description: "Explore DevX portfolio work across premium websites, SaaS products, and digital platforms.",
};

const PortfolioList = () => {
    return (
        <>
            <HeroSub
                title="Our | Clients"
                description="Our success is defined by the success of our clients. We build lasting partnerships by delivering technology solutions that create measurable impact and sustainable growth."
            />
            <Portfolio />
        </>
    );
};

export default PortfolioList;

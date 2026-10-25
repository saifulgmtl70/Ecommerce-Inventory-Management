import React from "react";

import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";

// ========================================
// TEAM MEMBERS
// ========================================

const teamMembers = [
    {
        id: 1,
        name: "Jenny Wilson",
        role: "Founder & CEO",
        image: "https://i.ibb.co/gvgcLWP/team-1.png",
        department: "Leadership & Vision",
        socials: {},
    },
    {
        id: 2,
        name: "Jane Cooper",
        role: "Operations Specialist",
        image: "https://i.ibb.co/dfsk5Hc/team-2.png",
        department: "Operations & Growth",
        socials: {},
    },
    {
        id: 3,
        name: "Robert Fox",
        role: "Product Manager",
        image: "https://i.ibb.co/2MF87xK/team-3.png",
        department: "Products & Quality",
        socials: {},
    },
    {
        id: 4,
        name: "Cody Fisher",
        role: "Customer Experience",
        image: "https://i.ibb.co/FWDFmft/Image-4.png",
        department: "Customer Satisfaction",
        socials: {},
    },
];

// ========================================
// SOCIAL ICONS
// ========================================

const socialPlatforms = [
    {
        key: "facebook",
        icon: FaFacebookF,
        label: "Facebook",
    },
    {
        key: "twitter",
        icon: FaXTwitter,
        label: "X",
    },
    {
        key: "instagram",
        icon: FaInstagram,
        label: "Instagram",
    },
    {
        key: "linkedin",
        icon: FaLinkedinIn,
        label: "LinkedIn",
    },
];

// ========================================
// OUR TEAM COMPONENT
// ========================================

const OurTeam = () => {
    return (
        <section className="about-team-section relative overflow-hidden py-20 sm:py-24 lg:py-28">

            <div className="about-team-glow about-team-glow-left"></div>
            <div className="about-team-glow about-team-glow-right"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* SECTION HEADING */}

                <div className="mx-auto mb-14 max-w-2xl text-center">

                    <div className="about-section-label mb-5">
                        THE PEOPLE BEHIND SHOPERY
                    </div>

                    <h2 className="about-section-title mb-5">

                        Meet Our

                        <span className="text-[#00B207]">
                            {" "}Amazing Team
                        </span>

                    </h2>

                    <p className="text-sm leading-8 text-gray-500 sm:text-base">

                        Great experiences begin with passionate people.
                        Meet the team dedicated to making shopping
                        simpler, smarter, and more enjoyable.

                    </p>

                </div>

                {/* TEAM GRID */}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">

                    {teamMembers.map((member) => {

                        const availableSocials = socialPlatforms.filter(
                            (platform) => member.socials?.[platform.key]
                        );

                        return (

                            <article
                                key={member.id}
                                className="about-team-card group"
                            >

                                {/* IMAGE */}

                                <div className="relative aspect-[4/4.5] overflow-hidden bg-[#EAF3EA]">

                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                    />

                                    <div className="about-team-overlay"></div>

                                    {/* SOCIAL LINKS */}

                                    {availableSocials.length > 0 && (

                                        <div className="absolute inset-x-0 bottom-5 flex flex-wrap justify-center gap-2 px-3">

                                            {availableSocials.map((platform) => {

                                                const Icon = platform.icon;

                                                return (

                                                    <a
                                                        key={platform.key}
                                                        href={member.socials[platform.key]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label={`${member.name} on ${platform.label}`}
                                                        className="about-social-link"
                                                    >

                                                        <Icon size={16} />

                                                    </a>

                                                );

                                            })}

                                        </div>

                                    )}

                                </div>

                                {/* TEAM INFO */}

                                <div className="p-6">

                                    <div className="about-team-accent mb-4"></div>

                                    <h3 className="mb-1 text-lg font-bold text-[#172B1B] transition-colors duration-300 group-hover:text-[#00B207]">

                                        {member.name}

                                    </h3>

                                    <p className="mb-4 text-sm font-semibold text-[#00B207]">

                                        {member.role}

                                    </p>

                                    <div className="border-t border-gray-100 pt-4">

                                        <p className="text-xs font-medium tracking-wide text-gray-400">

                                            {member.department}

                                        </p>

                                    </div>

                                </div>

                            </article>

                        );

                    })}

                </div>

            </div>

        </section>
    );
};

export default OurTeam;
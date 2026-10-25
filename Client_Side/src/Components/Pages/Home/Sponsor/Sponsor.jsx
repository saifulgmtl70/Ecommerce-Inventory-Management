
import React from "react";
import "./sponsor.css";

const sponsors = [
    {
        id: 1,
        image: "https://i.ibb.co/xDJsDLb/Vector-5.png",
        name: "Partner Brand 1",
    },
    {
        id: 2,
        image: "https://i.ibb.co/FHbjzvt/mango-1.png",
        name: "Partner Brand 2",
    },
    {
        id: 3,
        image: "https://i.ibb.co/56KLkyd/Vector.png",
        name: "Partner Brand 3",
    },
    {
        id: 4,
        image: "https://i.ibb.co/0X158wt/Vector-4.png",
        name: "Partner Brand 4",
    },
    {
        id: 5,
        image: "https://i.ibb.co/B472bdW/Vector-2.png",
        name: "Partner Brand 5",
    },
    {
        id: 6,
        image: "https://i.ibb.co/48JLMgy/Vector-3.png",
        name: "Partner Brand 6",
    },
];

const Sponsor = () => {
    return (
        <section className="shopery-sponsor-section">
            <div className="shopery-sponsor-container">

                <div className="shopery-sponsor-heading">
                    <span className="shopery-sponsor-subtitle">
                        OUR PARTNERS
                    </span>

                    <h2>
                        Brands We <span>Work With</span>
                    </h2>

                    <p>
                        Discover the brands featured on Shopery.
                    </p>
                </div>

                <div className="shopery-sponsor-grid">
                    {sponsors.map((sponsor) => (
                        <div
                            key={sponsor.id}
                            className="shopery-sponsor-card"
                        >
                            <img
                                src={sponsor.image}
                                alt={sponsor.name}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Sponsor;

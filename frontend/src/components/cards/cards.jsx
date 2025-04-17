import Star1 from './Star1.jpg';
import Calendar1 from './Calendar1.png';
import Card from './card.jsx'
import './card.css'



function Cards () {

    // Feature card buttons
    const cardData = [
        {id: 1, icon: '✔', featureName: "Calendar", image: Calendar1, link: "/calendar", alt: "calendar_schedule",message: "."},
        {id: 2, icon: '-', featureName: "Accounting", image: Star1, link: "/dashboard", alt: "accounting",message: "Coming Soon"},
        {id: 3, icon: '-', featureName: "Invoices", image: Star1, link: "/dashboard", alt: "invoices",message: "Coming Soon"},
        {id: 4, icon: '-', featureName: "Analytics", image: Star1, link: "/dashboard", alt: "analytics",message: "Coming Soon"},
        {id: 5, icon: '-', featureName: "Notes", image: Star1, link: "/dashboard", alt: "notes",message: "Coming Soon"},
        {id: 6, icon: '-', featureName: "Employees", image: Star1, link: "/dashboard", alt: "employees",message: "Coming Soon"},
        {id: 7, icon: '-', featureName: "Customer", image: Star1, link: "/dashboard", alt: "customer",message: "Coming Soon"},
        {id: 8, icon: '-', featureName: "Jobs", image: Star1, link: "/dashboard", alt: "jobs",message: "Coming Soon"},
        {id: 9, icon: '-', featureName: "Information", image: Star1, link: "/dashboard", alt: "information",message: "Coming Soon"},
        {id: 10, icon: '-', featureName: "Estimates", image: Star1, link: "/dashboard", alt: "estimates",message: "Coming Soon"},
        {id: 11, icon: '-', featureName: "Website", image: Star1, link: "/dashboard", alt: "website",message: "Coming Soon"},
        {id: 12, icon: '-', featureName: "Marketing", image: Star1, link: "/dashboard", alt: "marketing",message: "Coming Soon"},
        {id: 13, icon: '-', featureName: "Photos", image: Star1, link: "/dashboard", alt: "photos",message: "Coming Soon"},
    ]

    return (
        <div className="cards-container">
            {cardData.map(card => 
                <Card 
                    key={card.id}
                    icon={card.icon}
                    featureName={card.featureName}
                    image={card.image}
                    link={card.link}
                    alt={card.alt}
                    message={card.message}
                />
            )}
        </div>
    );
};

export default Cards;
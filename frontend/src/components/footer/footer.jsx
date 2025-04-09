import './footer.css'


function Footer () {

    const year = new Date().getFullYear();

    return (
        <>
            <p> &copy; {year} MWC Family </p>
        </>
    );
}

export default Footer
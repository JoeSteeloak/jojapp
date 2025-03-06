const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} MyBookReviews. All rights reserved.</p>
                <nav className="mt-4">
                    <ul className="flex justify-center space-x-6">
                        <li>
                            <a href="#" className="hover:text-white transition-colors">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white transition-colors">
                                Contact
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white transition-colors">
                                Privacy Policy
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;

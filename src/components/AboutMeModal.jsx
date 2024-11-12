import { useCallback } from 'react';
import { FaInstagram, FaGithub, FaDiscord, FaTimes } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // Ensure this import is correct
import Particles from "react-particles";
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim";

function AboutMeModal({ showAboutMe, setShowAboutMe }) {
    // Initialize and load particles
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        await console.log(container);
    }, []);

    return (
        showAboutMe && (
            <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                {/* Particle Background */}
                <Particles
                    id="tsparticles"
                    init={particlesInit}
                    loaded={particlesLoaded}
                    options={{
                        background: {
                            color: {
                                value: "transparent", // Keep particles background transparent
                            },
                        },
                        fpsLimit: 120,
                        interactivity: {
                            events: {
                                onClick: {
                                    enable: true,
                                    mode: "push",
                                },
                                onHover: {
                                    enable: true,
                                    mode: "repulse",
                                },
                                resize: true,
                            },
                            modes: {
                                push: {
                                    quantity: 4,
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.4,
                                },
                            },
                        },
                        particles: {
                            color: {
                                value: "#000000", // Set particles to black
                            },
                            links: {
                                color: "#000000", // Set link color to black
                                distance: 150,
                                enable: true,
                                opacity: 0.5,
                                width: 1,
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outModes: {
                                    default: "bounce",
                                },
                                random: false,
                                speed: 6,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    area: 800,
                                },
                                value: 80,
                            },
                            opacity: {
                                value: 0.5,
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                value: { min: 1, max: 5 },
                            },
                        },
                        detectRetina: true,
                    }}
                />

                {/* Modal Content */}
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative z-10">
                    <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-800"
                        onClick={() => setShowAboutMe(false)}
                    >
                        <FaTimes />
                    </button>
                    <h3 className="text-lg font-semibold mb-4">About Me</h3>
                    <p className="text-sm text-gray-700 mb-4">
                        Hi there, my name is <strong>Rupankar Bhuiya</strong>. I am currently in Class 11, pursuing a science stream. I am passionate about programming and technology, and I love working on exciting projects!
                    </p>
                    <h4 className="text-md font-semibold mb-2">Connect with Me:</h4>
                    <ul className="space-y-2 mb-4">
                        <li className="flex items-center space-x-2">
                            <FaInstagram className="text-pink-700" />
                            <a
                                href="https://www.instagram.com/yaa.its_rupankar.69"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:underline"
                            >
                                Instagram
                            </a>
                        </li>
                        <li className="flex items-center space-x-2">
                            <FaGithub className="text-gray-800" />
                            <a
                                href="https://github.com/rupankar008"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:underline"
                            >
                                GitHub
                            </a>
                        </li>
                        <li className="flex items-center space-x-2">
                            <FaDiscord className="text-indigo-800" />
                            <a
                                href="https://discord.gg/M6rWM4DjVz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                            >
                                Discord
                            </a>
                        </li>
                        <li className="flex items-center space-x-2">
                            <FaXTwitter className="text-black" />
                            <a
                                href="https://x.com/professor_toxi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:underline"
                            >
                                X
                            </a>
                        </li>
                    </ul>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                        onClick={() => setShowAboutMe(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    );
}

export default AboutMeModal;

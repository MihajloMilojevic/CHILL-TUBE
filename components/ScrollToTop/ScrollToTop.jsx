import { useState, useEffect } from "react";
import { FaAngleUp } from "@react-icons/all-files/fa/FaAngleUp";

import styles from "./ScrollToTop.module.css"

const ScrollToTop = () => {
    const [showTopBtn, setShowTopBtn] = useState(false);
    useEffect(() => {
        document.getElementById("content")?.addEventListener("scroll", () => {
            if (document.getElementById("content")?.scrollTop > 400) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const goToTop = () => {
        document.getElementById("content")?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <div className={styles.top_to_btm}>
            {" "}
            {showTopBtn && (
                <FaAngleUp
                    className={`${styles.icon_position} ${styles.icon_style}`}
                    onClick={goToTop}
                />
            )}{" "}
        </div>
    );
};
export default ScrollToTop;
import React from "react";
import ShufordSuite from "./images/shuford_suite.png";
import SharkTankView from "./images/shark_tank_view.png";
import ShufordSuiteWithCharacters from "./images/shuford_suite_with_characters.png";
import StageView from "./images/stage_view.png";
import CloseUpCharacters from "./images/close_up_characters.png";
import Particles from "react-particles-js";
import { particleConfig, particlePresets } from "./particleConfigurer.js";

function Screenshots() {
    return (
        <section id="screenshots" class="section_padding">
            <Particles
                params={{ particles: particleConfig(particlePresets.def) }}
                style={{
                    width: "100%",
                    position: "absolute",
                    top: 0
                }}
            />
            <div class="container">
                <div class="section_heading text-center">
                    <h2 class="contrast_heading_black">App Screenshots</h2>
                    <p class="contrast_text_black">Take a look at the VRWare pitch environment designed to help you deliver<br/>the perfect presentation - simulated in one of the best realistic practice settings possible.</p>
                </div>
                <div class="app_screens_slider">
                    <div class="single_screenshot">
                        <img src={ShufordSuite} alt="" />
                    </div>
                    <div class="single_screenshot">
                        <img src={SharkTankView} alt="" />
                    </div>
                    <div class="single_screenshot">
                        <img src={ShufordSuiteWithCharacters} alt="" />
                    </div>
                    <div class="single_screenshot">
                        <img src={StageView} alt="" />
                    </div>
                    <div class="single_screenshot">
                        <img src={CloseUpCharacters} alt="" />
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Screenshots;
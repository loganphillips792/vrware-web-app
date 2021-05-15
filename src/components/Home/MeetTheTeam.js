import React from "react";
import TrevorPicture from "./images/trevor.png";
import JiayiPicture from "./images/jiayi.png";
import HarrisonPicture from "./images/harrison.png";
import SameerPicture from "./images/sameer.png";
import LoganPicture from "./images/logan.png";

function MeetTheTeam() {
    return(
        <section id="meet_the_team_area" class="section_padding">
            <div class="container">
                <div class="section_heading text-center">
                    <h2 class="contrast_heading_black">Meet the Team</h2>

                    <p class="contrast_text_black">
                        We are a diverse and innovative group of students and young professionals with a passion for solving problems.
                        By utilizing and integrating multiple emerging technology platforms, we create impactful experiences to support
                        young entrepreneurs as they learn how to pitch. Scroll over each of our pictures to learn more about us!
                    </p>
                </div>
                <div class="row picture-row">
                    <div>
                        <div class="picture-container">
                            <img src={TrevorPicture} />
                            <div class="overlay">
                                <div class="overlay-text">
                                    <div>The University of North Carolina</div>
                                    <div>Computer Science</div>
                                    <div>2019</div>
                                </div>
                            </div>
                        </div>
                        <div class="name">
                            <h3>Trevor Scanlon</h3>
                        </div>
                        <div class="role">
                            CEO/Founder
                        </div>
                    </div>
                    <div>
                        <div class="picture-container">
                            <img src={JiayiPicture} />
                            <div class="overlay">
                                <div class="overlay-text">
                                    <div>The University of North Carolina</div>
                                    <div>Computer Science and Psychology</div>
                                    <div>2022</div>
                                </div>
                            </div>
                        </div>
                        <div class="name">
                            <h3>Jiayi Xu</h3>
                        </div>
                        <div class="role">
                            VR Developer
                        </div>

                    </div>
                   <div>
                   <div class="picture-container">
                        <img src={HarrisonPicture} />
                        <div class="overlay">
                            <div class="overlay-text">
                                <div>The University of North Carolina</div>
                                <div>Econmetrics and Quantitative Economics</div>
                                <div>2022</div>
                            </div>
                        </div>
                    </div>
                        <div class="name">
                            <h3>Harrison Lee</h3>
                        </div>
                        <div class="role">
                            Business Lead
                        </div>
                   </div>
                    <div>
                        <div class="picture-container">
                            <img src={SameerPicture} />
                            <div class="overlay">
                                <div class="overlay-text">
                                    <div>The University of North Carolina</div>
                                    <div>Computer Science and Business Administration</div>
                                    <div>2022</div>
                                </div>
                            </div>
                        </div>
                            <div class="name">
                                <h3>Sameer Rao</h3>
                            </div>
                            <div class="role">
                                VR Developer
                            </div>
                        </div>
                    <div>
                        <div class="picture-container">
                            <img src={LoganPicture} />
                            <div class="overlay">
                                <div class="overlay-text">
                                    <div>Lebanon Valley College</div>
                                    <div>Computer Science</div>
                                    <div>2019</div>
                                </div>
                            </div>
                        </div>
                        <div class="name">
                            <h3>Logan Phillips</h3>
                        </div>
                        <div class="role">
                            Fullstack Developer
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MeetTheTeam;
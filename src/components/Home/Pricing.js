import React from "react";
import Particles from "react-particles-js";
import particleConfig from "./particleConfig";

function Pricing() {
	return (
		<section id="pricing_table" class="welcome-area section_padding">
			<Particles
				params={{ particles: particleConfig.particles }}
				style={{
					width: "100%",
					position: "absolute",
					top: 0
				}}
			/>
			<div class="container">
				<div class="section_heading text-center">
					<h2 class="contrast_heading_white">Pricing Table</h2>
					<p>VRWare has various membership options. We can also customize to your needs,<br />based on which features are most preferable to you.</p>
				</div>
				<div class="pricing_table_row">
					<div class="pricingTable">
						<div class="price">
							<h3 class="heading">Individuals</h3>
							<span class="price-value">Free</span>
							{/* <span class="month">monthly</span> */}
						</div>
						<div class="pricingContent">
							<ul>
								<li><i class="ti-check"></i> Unlimited Pitch Practice</li>
								<li><i class="ti-check"></i> Basic Metrics</li>
								{/* <li><i class="ti-check"></i> 10 subdomains</li>
								<li><i class="ti-check"></i> 15 Domains</li> */}
							</ul>
						</div>
						<div class="pricingTable-signup">
							<a href="/practice" class="appbutton">Start Practicing</a>
						</div>
					</div>
					<div class="pricingTable">
						<div class="price">
							<h3 class="heading">Organizations</h3>
							<span class="price-value">Custom Pricing</span>
							{/* <span class="month">Flat Fee</span> */}
						</div>
						<div class="pricingContent">
							<ul>
								<li><i class="ti-check"></i>Unlimited Pitch Practice</li>
								<li><i class="ti-check"></i>Unlimited Pitch Retention</li>
								<li><i class="ti-check"></i>Basic Metrics</li>
								<li><i class="ti-check"></i>Eye, Hand, and Body positioning tracking</li>
								<li><i class="ti-check"></i>Custom-built VR scenes</li>
								<li><i class="ti-check"></i>VR Headset support</li>
							</ul>
						</div>
						<div class="pricingTable-signup">
							<a href="/contact" class="appbutton">Contact Us</a>
						</div>
					</div>
					<div class="pricingTable">
						<div class="price">
							<h3 class="heading">Individuals</h3>
							<span class="price-value">$25</span>
							<span class="month">Monthly</span>
						</div>
						<div class="pricingContent">
							<ul>
								<li><i class="ti-check"></i>Unlimited Pitch Practice</li>
								<li><i class="ti-check"></i>Unlimited Pitch Retention</li>
								<li><i class="ti-check"></i>Basic Metrics</li>
								<li><i class="ti-check"></i>Sideload VR scenes</li>
							</ul>
						</div>
						<div class="pricingTable-signup">
							<a href="/login" class="appbutton">Order Now</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Pricing;
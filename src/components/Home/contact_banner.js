import React from "react";
import Particles from "react-particles-js";
import particleConfig from "./particleConfig";
import { API_URL } from "../../constants.js";

function ContactBanner() {
  const height = window.height + "px";


  function submitForm(e) {

    // so the form doesnt submit
    e.preventDefault();

    let formData = new FormData();
    formData.append('first_name', document.getElementById('first-name').value);
    formData.append('last_name', document.getElementById('last-name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('description', document.getElementById('description').value);

    fetch(API_URL+"api/email", {
      method: "POST",
      body: formData
    }).then(response => {
      if(response.status === 201) {
        window.location.href = "/"
      } else if (response.status === 422) {
        throw new Error('Email failed to send');
      }
    }).catch(error => alert(error));
  }

  return (
    <section id="slider_area" class="welcome-area" style={{ height: "100%" }}>
      <Particles
        params={{ particles: particleConfig.particles }}
        style={{
          width: "100%",
          position: "absolute",
          top: 0
        }}
      />
      <section class="section_padding">
        <div class="container">
          <div class="section_heading text-center">
            <h2 class="contrast_heading_white">Schedule a live demo</h2>
          </div>
          <div class="row">
            <div class="col-lg-4 col-md-offset-4">
              <div class="contact_form">
                <form
                  id="contact-form"
                  //onsubmit={submitForm}
                  //method="post"
                  //action={API_URL + "api/email"}
                  //enctype="multipart/form-data"
                >
                  <div class="row">
                    <div class="form-group col-md-12">
                      <input
                        type="text"
                        name="first_name"
                        class="form-control"
                        id="first-name"
                        placeholder="First Name"
                        required="required"
                      />
                    </div>
                    <div class="form-group col-md-12">
                      <input
                        type="text"
                        name="last_name"
                        class="form-control"
                        id="last-name"
                        placeholder="Last Name"
                        required="required"
                      />
                    </div>

                    <div class="form-group col-md-12">
                      <input
                        type="email"
                        name="email"
                        class="form-control"
                        id="email"
                        placeholder="Email"
                        required="required"
                      />
                    </div>

                    <div class="form-group col-md-12">
                      <textarea
                        rows="6"
                        name="inquiry"
                        class="form-control"
                        id="description"
                        placeholder="Inquiry details"
                        required="required"
                      />
                    </div>

                    <div class="col-md-4 center-block">
                      <input
                        type="button"
                        value="Submit"
                        name="submit"
                        id="submit"
                        class="app_store"
                        onClick={submitForm}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default ContactBanner;

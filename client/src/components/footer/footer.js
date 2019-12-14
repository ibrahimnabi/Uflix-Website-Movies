import React from "react";
import "./footer.css";
import { catagories } from "../../util/api";
import { Link } from "react-router-dom";

const getCatagories = () => {
  let result = catagories.map((c, i) => {
    return (
      <li>
        <Link to="/">{c}</Link>
      </li>
    );
  });
  result.shift();
  return result;
};

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <h6>About</h6>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          efficitur sagittis eros at rutrum. Phasellus eu nunc turpis. Nullam
          iaculis ut sapien vitae laoreet. Vivamus ultricies semper dolor,
          iaculis semper turpis gravida id. Morbi in tempor velit. Donec at
          pretium erat, id efficitur lacus. Donec et pellentesque ex. Proin sem
          sapien, ullamcorper id lacus non, scelerisque interdum tortor. Duis
          viverra diam et turpis ornare, ut egestas metus aliquet. Integer
          consequat cursus est, quis accumsan tortor fringilla at. Sed quam
          orci, vehicula ac aliquam quis, molestie sed nulla. Vestibulum
          pulvinar rhoncus dolor et imperdiet. Nulla vel dui lobortis, accumsan
          arcu tempor, bibendum est. Proin eu risus quis justo facilisis dictum
          a id erat.
        </p>
      </div>

      <div>
        <h6>Categories</h6>
        <ul className="footer-links catagories">{getCatagories()}</ul>
      </div>

      <div>
        <h6>Quick Links</h6>
        <ul className="footer-links">
          <li>
            <a target="_blank" href="#">
              About Us
            </a>
          </li>
          <li>
            <a target="_blank" href="#">
              Contact Us
            </a>
          </li>
          <li>
            <a target="_blank" href="#">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>

      <div className="container">
        <div>
          <ul className="social-icons">
            <li>
              <a
                target="_blank"
                className="facebook"
                href="https://www.facebook.com/Uflix-110843250375519/"
              >
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="twitter"
                href="https://twitter.com/Uflix2?s=08"
              >
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="instagram"
                href="https://instagram.com/uflix.official?igshid=1g4hv04c3v4k0"
              >
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="youtube"
                href="https://m.youtube.com/channel/UCab5HeqX6VxGogB4N5qBB4g"
              >
                <ion-icon name="logo-youtube"></ion-icon>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="copyright-text">
            Copyright &copy; 2019 All Rights Reserved by
            <a href="/"> Uflix</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}

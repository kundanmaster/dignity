import Image from "next/image";
import Link from "next/link";
import React from "react";
const Instructor = () => {
  return (
    <>
      <div className="bg-[#fbf6ef] py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/images/pages/at12.png"
              alt="Training 1"
              width={500}
              height={500}
              className="rounded-lg shadow-md object-cover h-40 w-80"
            />
            <Image
              src="/images/pages/at13.png"
              alt="Training 2"
              width={500}
              height={500}
              className="rounded-lg shadow-md object-cover h-40 w-56"
            />
            <Image
              src="/images/pages/at14.png"
              alt="Training 3"
              width={500}
              height={500}
              className="rounded-lg shadow-md object-cover h-40 w-80"
            />
            <Image
              src="/images/pages/at15.png"
              alt="Training 4"
              width={500}
              height={500}
              className="rounded-lg shadow-md object-cover h-40 w-56"
            />
            <Image
              src="/images/pages/at12.png"
              alt="Training 5"
              width={500}
              height={500}
              className="rounded-lg shadow-md object-cover col-span-2 h-40 w-[34rem]"
            />
            <Image
              src="/images/pages/at11.png"
              alt="Training 6"
              width={500}
              height={500}
              className="rounded-lg shadow-md object-cover col-span-2 h-40 w-[34rem]"
            />
          </div>

          <div className="flex flex-col justify-center" id="Instructors">
            <h2 className="text-goldlight text-3xl font-bold mb-6">
              What makes us different?
            </h2>
            <ul className="text-gray-700 space-y-3 mb-8">
              <li>
                <strong>Flexible Scheduling:</strong> We offer evening and
                weekend classes to accommodate busy schedules.
              </li>
              <li>
                <strong>Online and Onsite Training:</strong> DMT's services are
                dedicated to Phoenix, offering comprehensive healthcare training
                and practical experience.
              </li>
              <li>
                <strong>Language:</strong> Our courses are available in English
                so that language does not limit your educational opportunities.
              </li>
              <li>
                <strong>Updated:</strong> Our courses are constantly updated to
                meet the changing needs of our industry.
              </li>
            </ul>
            <div className="flex space-x-4">
              <Link href="/allCoures">
                <button className="bg-primarygold text-white py-2 px-4 rounded hover:bg-goldlight hover:text-white transition-colors duration-300">
                  VIEW ALL COURSES
                </button>
              </Link>
              <a className="" href="#online" >
                <button className="border border-goldlight text-primarygold hover:bg-goldlight hover:text-white py-2 px-4 rounded-lg shadow-md">
                  CHECK OUT OUR ONLINE ZOOM CLASSES
                </button>
              </a>
            </div>
          </div>
        </div>
        <section className="flex justify-center items-center py-10 bg-white">
          <div className="bg-goldlight py text-white flex rounded-md overflow-hidden">
            {/* Text Section */}
            <div
              className="p-8 md:w-2/5"
              style={{ borderRadius: "15px 0 0 15px" }}
            >
              <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg">
                Dignity Medical Training's mission is to set the standard in
                caregiver education. We inspire excellence, positively impact
                our community, and transform lives through comprehensive and
                engaging training programs.
              </p>
            </div>
            {/* Image Section */}
            <div className="relative md:w-3/5">
              <Image
                src="/images/pages/mission.png"
                alt="Mission"
                layout="fill"
                objectFit="cover"
                style={{ borderRadius: "0 15px 15px 0" }}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Instructor;

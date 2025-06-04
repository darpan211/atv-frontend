import React from "react";
import { Icon } from "../common/icons";
import img from "../../assets/image3.png";

export default function BlockDesign() {
     const services = [
          {
               title: "Design development",
               description:
                    "The architecture company meets with the client to discuss their needs, budget, and timeline.",
               icon: <div className="">{<Icon name="Square" height={'50px'} width={'50px'} />}</div>,
          },
          {
               title: "Concept design",
               description:
                    "Based on the client's requirements, the architecture company creates a concept design that fits their vision.",
               icon: <div className="">{<Icon name="Vector" height={'50px'} width={'50px'} />}</div>,
          },
          {
               title: "Permitting and approvals",
               description:
                    "Before construction can begin, the architecture company must obtain the necessary permits and approvals from local authorities.",
               icon:<div className="">{<Icon name="Layers" height={'50px'} width={'50px'} />}</div>,
          },
     ];

     return (
          <div
               className="bg-cover bg-center py-20 px-4 sm:px-6 lg:px-16 text-white"
               style={{ backgroundImage: `url(${img})` }}
          >
               <div className="max-w-7xl mx-auto grid gap-y-16 gap-x-10 md:grid-cols-3 text-center">
                    {services.map((item, index) => (
                         <div key={index} className="flex flex-col items-center space-y-5">
                              <div className="border border-white rounded-lg p-5">
                                   {item.icon}
                              </div>
                              <h3 className="text-xl font-semibold text-center">{item.title}</h3>
                              <p className="text-sm text-gray-300 px-3 max-w-xs line-clamp-3 text-center">
                                   {item.description}
                              </p>
                         </div>
                    ))}
               </div>
          </div>
     );
}
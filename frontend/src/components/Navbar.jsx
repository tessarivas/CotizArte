import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/CotizArte_Logo.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      <div className="bg-base-100 shadow-lg rounded-xl p-4 w-full">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img
              src={logo}
              alt="CotizArte Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <NavigationMenu>
            <NavigationMenuList className="border-0 shadow-none bg-transparent p-0">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base-content hover:bg-base-300 focus:bg-base-300">
                  Inicio
                </NavigationMenuTrigger>
                <NavigationMenuContent className="border-0 shadow-none bg-transparent p-0">
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] bg-base-100 rounded-xl shadow-lg">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-base-300 hover:text-base-content focus:bg-base-300 focus:text-base-content text-base-content"
                        >
                          <div className="text-sm font-medium leading-none">
                            Página Principal
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-base-content/70">
                            Bienvenido a nuestra página de inicio
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base-content hover:bg-base-300 focus:bg-base-300">
                  Servicios
                </NavigationMenuTrigger>
                <NavigationMenuContent className="border-0 shadow-none bg-transparent p-0">
                  <ul className="grid w-[200px] gap-3 p-4 bg-base-100 rounded-xl shadow-lg">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/servicios/web"
                          className={`${navigationMenuTriggerStyle()} text-base-content hover:bg-base-300 hover:text-base-content`}
                        >
                          Calcular
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/servicios/movil"
                          className={`${navigationMenuTriggerStyle()} text-base-content hover:bg-base-300 hover:text-base-content`}
                        >
                          Cotizaciones
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/servicios/diseno"
                          className={`${navigationMenuTriggerStyle()} text-base-content hover:bg-base-300 hover:text-base-content`}
                        >
                          Mercado
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/contacto"
                  className={`${navigationMenuTriggerStyle()} bg-secondary text-secondary-content hover:bg-primary hover:text-primary-content transition-colors`}
                >
                  Iniciar Sesión
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}

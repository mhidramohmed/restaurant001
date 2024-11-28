'use client';

import Logo from "@/components/Logo";
import CircleButton from "@/components/CircleButton";

import Link from "next/link";

import { HiOutlinePhone, HiOutlineLocationMarker, HiOutlinePlusSm } from "react-icons/hi";


const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      {/* Header */}
      <header className="border-b border-primary p-4 bg-background text-text">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">
            <Link href='/' className="flex-shrink-0">
                <Logo />
            </Link>
            <div className="flex gap-1 md:gap-4">
                <CircleButton body="+212605274561" href="tel:+212605274561" icon={<HiOutlinePhone />} />
                <CircleButton body="Marrakech" href="https://maps.app.goo.gl/z1u3aWaZuMSjftQx8" icon={<HiOutlineLocationMarker />} />
                <CircleButton body="Visit our website" href="https://bonsai-marrakech.com/" icon={<HiOutlinePlusSm />} />
            </div>
            </div>
        </header>
      {/* Page Content */}
      <main className="flex-grow px-6 py-8 sm:px-12 md:px-24 lg:px-36">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Conditions Générales d'Utilisation
        </h1>
        <p className="mb-6">
          Bienvenue sur <span className="font-bold">Bonsaï</span>, votre destination gastronomique préférée à Marrakech !
          En naviguant sur notre site internet{' '}
          <a
            href="https://bonsai-marrakech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            https://bonsai-marrakech.com
          </a>{' '}
          ou en utilisant nos services, vous acceptez les présentes conditions générales d'utilisation. Veuillez les lire
          attentivement avant de poursuivre.
        </p>

        {/* Terms Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">1. Informations légales</h2>
            <p>
              Le site internet{' '}
              <a
                href="https://bonsai-marrakech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                https://bonsai-marrakech.com
              </a>{' '}
              est édité par Bonsaï Marrakech, dont l’adresse est située à Marrakech, Maroc.
            </p>
            <p>
              Pour toute question ou assistance, contactez-nous via WhatsApp au{' '}
              <a href="tel:+212605274561" className="text-primary underline">
                +212 605-274561
              </a>
              .
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">2. Utilisation du site</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Utiliser les contenus de manière personnelle et non commerciale.</li>
              <li>Ne pas reproduire, distribuer ou modifier les contenus sans autorisation écrite préalable.</li>
              <li>Respecter les lois marocaines en vigueur.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">3. Réservations et commandes</h2>
            <p>
              Les réservations ou commandes effectuées via notre site ou WhatsApp sont soumises à disponibilité. Nous
              nous réservons le droit de modifier ou annuler une réservation en cas de circonstances exceptionnelles.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">4. Confidentialité</h2>
            <p>
              Vos données personnelles sont traitées conformément à notre politique de confidentialité. Nous nous
              engageons à protéger vos informations et à ne pas les partager sans votre consentement.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">5. Responsabilité</h2>
            <p>
              Nous mettons tout en œuvre pour assurer l’exactitude des informations disponibles sur notre site.
              Cependant, nous ne pouvons être tenus responsables des erreurs ou omissions éventuelles.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">6. Modification des conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des
              mises à jour importantes via le site.
            </p>
            <p>
              En continuant à utiliser nos services, vous confirmez avoir lu et accepté ces conditions. Merci de faire
              confiance à <span className="font-bold">Bonsaï Marrakech</span>, et bon appétit !
            </p>
            <p>
              Pour toute assistance, contactez-nous au{' '}
              <a href="tel:+212605274561" className="text-primary underline">
                +212 605-274561
              </a>{' '}
              ou rendez-vous sur{' '}
              <a
                href="https://bonsai-marrakech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                bonsai-marrakech.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="my-6 mx-4 p-4 bg-primary text-background rounded-lg shadow-md">
        <div className="flex justify-around items-center">
          <p>&copy; 2024 Bonsai Marrakech. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;

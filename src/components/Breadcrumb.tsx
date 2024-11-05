import Link from 'next/link';
import { useRouter } from 'next/router';

const Breadcrumb = () => {
  const router = useRouter();
  const pathArray = router.asPath.split('/').filter((segment) => segment);
  const currentId = pathArray[pathArray.length - 1].match(/^[a-fA-F0-9-]{36}$/) ? pathArray.pop() : null; // Check if last segment is an ID and remove it if it is

  const breadcrumbLinks = pathArray.map((segment, index) => {
    let href = `/${pathArray.slice(0, index + 1).join('/')}`;

    // If we are at the last segment and it is an ID, append it
    if (index === pathArray.length - 1 && currentId) {
      href += `/${currentId}`;
    }

    const displayName = segment === "partner" ? "Home"
                    : segment === "facility" ? "Facility"
                    : segment === "fields" ? "Fields"
                    : segment === "timeslot" ? "Timeslot"
                    : segment;

    const isCurrentPage = index === pathArray.length - 1;

    return (
      <span key={href} className="flex items-center">
        {!isCurrentPage ? (
          <Link href={href} className="text-blue-600 hover:underline">
            {displayName}
          </Link>
        ) : (
          <span className="text-gray-500">{displayName}</span>
        )}
        {index < pathArray.length - 1 && <span className="mx-2">/</span>}
      </span>
    );
  });

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <div className="flex text-sm text-gray-600">
        {breadcrumbLinks}
      </div>
    </nav>
  );
};

export default Breadcrumb;

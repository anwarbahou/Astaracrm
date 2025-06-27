import { UserRoleManager } from "@/components/UserRoleManager";
import { withPageTitle } from '@/components/withPageTitle';

function Users() {
  return (
    <div className="container mx-auto py-6">
      <UserRoleManager />
    </div>
  );
}

export default withPageTitle(Users, 'users');

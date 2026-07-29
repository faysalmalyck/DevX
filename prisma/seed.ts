import { PrismaClient, ServiceStatus, ActivityStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/hash";

import "dotenv/config";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

const permissionModules = [
  "Dashboard",
  "Website Pages",
  "Hero Section",
  "Services",
  "Portfolio",
  "Clients",
  "Testimonials",
  "Blogs",
  "Careers",
  "Jobs",
  "Applications",
  "Media Library",
  "Team Members",
  "Contacts",
  "Newsletter",
  "SEO",
  "Website Settings",
  "Appearance",
  "Navigation",
  "Analytics",
  "Users",
  "Administrators",
  "Roles",
  "Permissions",
  "Audit Logs",
  "System Settings",
];

const permissionActions = [
  "VIEW",
  "CREATE",
  "EDIT",
  "DELETE",
  "PUBLISH",
  "APPROVE",
  "EXPORT",
  "IMPORT",
  "MANAGE",
];

async function main() {
  console.log("🌱 Start seeding...");

  // 1. Seed Permissions Matrix
  console.log("Seeding permissions...");
  const createdPermissions = [];
  for (const m of permissionModules) {
    for (const a of permissionActions) {
      const perm = await prisma.permission.upsert({
        where: {
          module_action: {
            module: m,
            action: a as any,
          },
        },
        update: {},
        create: {
          module: m,
          action: a as any,
        },
      });
      createdPermissions.push(perm);
    }
  }
  console.log(`Seeded ${createdPermissions.length} permissions.`);

  // 2. Seed Default Roles
  console.log("Seeding roles...");
  const ceoRole = await prisma.role.upsert({
    where: { name: "CEO" },
    update: {},
    create: {
      name: "CEO",
      slug: "ceo",
      description: "CEO & Founder - Super Admin",
      isSuperAdmin: true,
      isSystem: true,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "Administrator" },
    update: {},
    create: {
      name: "Administrator",
      slug: "administrator",
      description: "Standard Administrator",
      isSuperAdmin: false,
      isSystem: true,
    },
  });

  // 3. Link Administrator role to all permissions
  console.log("Linking permissions to Administrator role...");
  for (const perm of createdPermissions) {
    // Standard admins get everything except SYSTEM_SETTINGS manage, but for simplicity let's link all permissions
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // 4. Seed default CEO Admin
  console.log("Seeding CEO administrator...");
  const defaultCeoEmail = "ceo@DevX.com";
  const hashedCeoPassword = await hashPassword("faysal123");
  const ceo = await prisma.admin.upsert({
    where: { email: defaultCeoEmail },
    update: {},
    create: {
      id: "ceo-faysal-mushtaq",
      firstName: "Faysal",
      lastName: "Mushtaq",
      email: defaultCeoEmail,
      username: "faysal",
      password: hashedCeoPassword,
      roleId: ceoRole.id,
      status: "ACTIVE",
      twoFactorEnabled: true,
      requirePasswordChange: false,
      designation: "CEO & Founder",
      department: "Management",
    },
  });

  // 5. Seed default Client User
  console.log("Seeding client user...");
  const defaultUserEmail = "client@company.com";
  const hashedUserPassword = await hashPassword("client123");
  const user = await prisma.user.upsert({
    where: { email: defaultUserEmail },
    update: {},
    create: {
      firstName: "Faysal",
      lastName: "Client",
      email: defaultUserEmail,
      username: "faysalclient",
      password: hashedUserPassword,
      status: "ACTIVE",
      role: "Client",
    },
  });

  // 6. Seed sample user dashboard items
  console.log("Seeding sample client portal data...");

  // Sample service requests
  const serviceRequests: Array<{
    serviceName: string;
    status: ServiceStatus;
    progress: number;
    notes: string;
    assignedTeam: string;
    deliveryDate: Date;
  }> = [
    {
      serviceName: "SaaS Platform Development",
      status: ServiceStatus.IN_PROGRESS,
      progress: 65,
      notes: "Sprint 4 active. Core auth and payment gates completed.",
      assignedTeam: "Alpha Team",
      deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      serviceName: "AI Chatbot Integration",
      status: ServiceStatus.PENDING,
      progress: 10,
      notes: "Awaiting final API keys and scoping parameters.",
      assignedTeam: "AI Solutions Division",
      deliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
    {
      serviceName: "Cloud Migration",
      status: ServiceStatus.COMPLETED,
      progress: 100,
      notes: "Infrastructure migrated to AWS. Performance verified.",
      assignedTeam: "DevOps & Cloud Team",
      deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const sr of serviceRequests) {
    await prisma.serviceRequest.create({
      data: {
        ...sr,
        userId: user.id,
      },
    });
  }

  // Sample planned activities
  const plannedActivities: Array<{
    title: string;
    description: string;
    type: string;
    scheduledAt: Date;
    status: ActivityStatus;
  }> = [
    {
      title: "Sprint Scoping Meeting",
      description: "Discuss UI requirements and DB modifications",
      type: "meeting",
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: ActivityStatus.SCHEDULED,
    },
    {
      title: "Milestone: UI Scopes Handover",
      description: "Review Figma screens with design lead",
      type: "milestone",
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: ActivityStatus.SCHEDULED,
    },
    {
      title: "Technical Consultation",
      description: "Discuss API structures and caching mechanisms",
      type: "consultation",
      scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: ActivityStatus.COMPLETED,
    },
  ];

  for (const act of plannedActivities) {
    await prisma.plannedActivity.create({
      data: {
        ...act,
        userId: user.id,
      },
    });
  }

  // Sample support tickets
  const ticket = await prisma.supportTicket.create({
    data: {
      subject: "API Integration Webhook Failure",
      category: "SaaS",
      priority: "HIGH",
      status: "OPEN",
      userId: user.id,
    },
  });

  await prisma.ticketMessage.createMany({
    data: [
      {
        ticketId: ticket.id,
        senderId: user.id,
        senderType: "user",
        senderName: `${user.firstName} ${user.lastName}`,
        content: "Hi support team, our webhook endpoint receives 500 errors during client checkouts. Can you audit our API keys?",
      },
      {
        ticketId: ticket.id,
        senderId: ceo.id,
        senderType: "admin",
        senderName: `${ceo.firstName} ${ceo.lastName}`,
        content: "Hello Faysal, I checked the transaction audit trail. The webhook fails due to a missing header key. I will assign a developer to send you the corrected metadata payload.",
      },
    ],
  });

  // Sample notifications
  const notifications = [
    {
      recipientId: user.id,
      recipientType: "user",
      type: "PROJECT_UPDATE",
      title: "SaaS Platform Update",
      message: "Sprint 3 was completed successfully. Core auth system is ready for testing.",
      link: "/account/services",
    },
    {
      recipientId: user.id,
      recipientType: "user",
      type: "MESSAGE",
      title: "Support Ticket Reply",
      message: "Operator Faysal Mushtaq has replied to your webhook ticket.",
      link: "/account/support",
    },
    {
      recipientId: user.id,
      recipientType: "user",
      type: "SECURITY",
      title: "New Login Detected",
      message: "Successful login session established from Chrome / MacOS.",
      link: "/account/profile",
    },
  ];

  await prisma.notification.createMany({
    data: notifications,
  });

  console.log("🌱 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

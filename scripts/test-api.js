// Robust smoke test for local API endpoints. It will try common dev ports (3000-3010).
const portsToTry = Array.from({ length: 11 }, (_, i) => 3000 + i);

async function probePort(port, path, options = {}) {
  const base = `http://localhost:${port}`;
  try {
    const res = await fetch(`${base}${path}`, options);
    return { ok: true, res };
  } catch (e) {
    return { ok: false, err: e };
  }
}

async function findServer() {
  for (const port of portsToTry) {
    const { ok } = await probePort(port, "/api/auth/login", {
      method: "OPTIONS",
    }).catch(() => ({ ok: false }));
    if (ok) return port;
  }
  return null;
}

async function test() {
  console.log("Locating dev server on ports 3000-3010...");
  const port = await findServer();
  if (!port) {
    console.error(
      "Could not find a running dev server on localhost:3000-3010."
    );
    process.exit(2);
  }

  const base = `http://localhost:${port}`;
  console.log(`Found server on port ${port}. Running tests against ${base}`);

  console.log("Testing signup...");
  let res = await fetch(`${base}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "tester",
      password: "testpass123",
      firstName: "Test",
    }),
  });
  console.log("Signup status", res.status);
  console.log(await res.json());

  console.log("Testing login...");
  res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "tester", password: "testpass123" }),
  });
  console.log("Login status", res.status);
  console.log(await res.json());
}

test().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});

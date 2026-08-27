type DeploymentEnvironment = {
  isVercel?: boolean;
  region?: string;
  commitSha?: string;
  nodeVersion?: string;
};

const safeToken = (value: string | undefined, pattern: RegExp, fallback: string) =>
  value && pattern.test(value) ? value : fallback;

export function describeDeployment(input: DeploymentEnvironment) {
  const commit = safeToken(input.commitSha, /^[a-f0-9]{7,40}$/i, 'local');
  const region = safeToken(input.region, /^[a-z0-9-]{2,16}$/i, 'local');
  const runtime = safeToken(input.nodeVersion, /^v?\d+\.\d+\.\d+$/, 'unknown');

  return {
    platform: input.isVercel ? 'Vercel' : 'Local development',
    compute: input.isVercel ? 'Vercel Functions' : 'Next.js Node.js server',
    region,
    commit: commit === 'local' ? commit : commit.slice(0, 7),
    runtime: `Node.js ${runtime.replace(/^v/, '')}`,
  };
}

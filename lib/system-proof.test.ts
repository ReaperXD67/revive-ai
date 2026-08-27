import assert from 'node:assert/strict';
import test from 'node:test';
import { describeDeployment } from './system-proof.ts';

test('returns a compact public Vercel deployment description', () => {
  assert.deepEqual(describeDeployment({
    isVercel: true,
    region: 'sin1',
    commitSha: '66049b020e0a1fb9c51e80297ae9fc2ba2bfab94',
    nodeVersion: 'v22.13.0',
  }), {
    platform: 'Vercel',
    compute: 'Vercel Functions',
    region: 'sin1',
    commit: '66049b0',
    runtime: 'Node.js 22.13.0',
  });
});

test('does not reflect unsafe environment values into a public response', () => {
  assert.deepEqual(describeDeployment({
    isVercel: true,
    region: '<script>alert(1)</script>',
    commitSha: 'secret token with spaces',
    nodeVersion: 'process.env.SECRET',
  }), {
    platform: 'Vercel',
    compute: 'Vercel Functions',
    region: 'local',
    commit: 'local',
    runtime: 'Node.js unknown',
  });
});

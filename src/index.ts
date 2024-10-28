import { PluginDefinition, setupPluginServer } from 'connery';
import onlineSearchWithPerplexity from "./actions/onlineSearchWithPerplexity.js";

const pluginDefinition: PluginDefinition = {
  name: 'Perplexity',
  description: 'Connery plugin for Perplexity online web search.',
  actions: [onlineSearchWithPerplexity],
};

const handler = await setupPluginServer(pluginDefinition);
export default handler;

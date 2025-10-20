import { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } from "@aws-sdk/client-bedrock-agentcore";

const input_text = "Explain machine learning in simple terms"
const client = new BedrockAgentCoreClient({
    region: "us-east-1"
});

const payloadData = {
    prompt: "Hello i want to know my love life future",
    actor_id: "default_user",
    session_id: "default_session8"
}

const input = {
    runtimeSessionId: "dfmeoagmreaklgmrkleafremoigrmtesogmtrskhmtkrlshhyh",  // Must be 33+ chars
    agentRuntimeArn: "arn:aws:bedrock-agentcore:us-east-1:161409283793:runtime/chatdestiny-CpdlPd2w1j",
    qualifier: "DEFAULT", // Optional
    payload: Buffer.from(JSON.stringify(payloadData), 'utf8') // e.g. Buffer.from(input_text) or new TextEncoder().encode(input_text)   // required
};

try {
    const command = new InvokeAgentRuntimeCommand(input);
    const response = await client.send(command);
    const textResponse = await response.response.transformToString();
} catch (error) {
    console.log(error)
}

'''
Testing out the AWS multi-agent orchestrator library
'''
import os
import shutil

import gradio as gr
from multi_agent_orchestrator.orchestrator import MultiAgentOrchestrator
from multi_agent_orchestrator.agents import (
    BedrockLLMAgent,
    BedrockLLMAgentOptions,
    AgentCallbacks
)
from multi_agent_orchestrator.types import ConversationMessage

import boto3
from botocore.config import Config

from tools import filesystem_tool

class BedrockLLMAgentCallbacks(AgentCallbacks):
    '''
    Generic agent callback
    '''
    def on_llm_new_token(self, token: str) -> None:
        # handle response streaming here
        print(token, end="", flush=True)


class UIClient:
    '''
    Generic wrapper class for gradio UI
    '''

    def __init__(self) -> None:
        
        self.orchestrator = MultiAgentOrchestrator()
        self.register_agents()

    def draw_ui(self):
        """
        Main entrypoint
        """
        gr.ChatInterface(self.chat_responder).launch()

    async def chat_responder(self, question, history):
        """
        Example Question:
        As an elf, which information do I have available?
        See script.txt in the project root for a scenario
        """
        response = await self.orchestrator.route_request(
            question, "shankinson", "session001"
        )
        print("\n** HISTORY ** \n")
        print(history)
        # Handle non-streaming response (AgentProcessingResult)
        print("\n** RESPONSE ** \n")
        print(f"> Agent ID: {response.metadata.agent_id}")
        print(f"> Agent Name: {response.metadata.agent_name}")
        print(f"> User Input: {response.metadata.user_input}")
        print(f"> User ID: {response.metadata.user_id}")
        print(f"> Session ID: {response.metadata.session_id}")
        print(f"> Additional Parameters: {response.metadata.additional_params}")
        print(f"\n> Response: {response.output.content}")
        if isinstance(response.output, ConversationMessage):
            return response.output.content[0].get("text")
        else:
            return "Error processing response"

    def register_agents(self):
        '''
        Register all of the agents in this workflow with mutli-agent-orchestrator
        '''

        # Added implementation notes for the Solver and Implementer
        implementation_notes = '''
        # Project Definition
        This project aims to develop self-contained solutions to logic puzzles presented via Advent of Code.  It will consume the narrative entries and extract business requirements to solve puzzle inputs.
        
        #Project Vision
        Develop a simple node.js application to calculate solutions to coding puzzles.

        # Puzzle Format
        - All puzzles will be provided via a long form narrative in puzzle.txt.  These will provide examples and required calculations to be performed with a separate input file.
        - Puzzles can provide additional information which alters the required behavior via puzzle2.txt.
        - The actual puzzle input used for calculating the solution will be provided via input.txt.

        # Non-Functional Requirements
        - Industry-standard coding practices should be followed.
        - Comprehensive documentation should be provided within source code for all requirements
        - Unless instructed otherwise, all solutions should rely on standard Typescript without external dependencies
      
        # Technology Stack
        - Language: TypeScript
        - Package Manager: npm
        '''
        
        
        # Claude likes to think about it -- give more time than the boto3 default 60s
        session = boto3.Session()
        config = Config(read_timeout=300)
        longer_client = session.client("bedrock-runtime", config=config)

        puzzle_agent = BedrockLLMAgent(
            BedrockLLMAgentOptions(
                name="Puzzle Solver",
                streaming=False,
                description="Specializes in reading the initial puzzle to pull separate narrative fluff from meaningful \
                    content. Responsible for thinking about the puzzle details and translating them into logical steps to \
                    generate a solution.  Provides solution approach and code examples in Markdown format. Please also keep \
                    the follwing details in minde:\n\n{implementation_notes}",
                model_id="us.anthropic.claude-3-5-sonnet-20241022-v2:0",
                inference_config={
                    'maxTokens': 8192,
                    'temperature': 0.0
                },
                tool_config={
                    "tool": filesystem_tool.filesystem_tools_description,
                    "toolMaxRecursion": 5,
                    "useToolHandler": filesystem_tool.file_tools_handler,
                },
                callbacks=BedrockLLMAgentCallbacks(),
                client=longer_client
            )
        )
        puzzle_agent.set_system_prompt(
            filesystem_tool.filesystem_tools_prompt,
            {
                "ROLE": "Puzzle Reader",
                "ROLE_INPUT_FOLDER": "./work/01_PUZZLE",
                "ROLE_OUTPUT_FOLDER": "./work/02_PUZZLE_SOLUTION",
            },
        )
        self.orchestrator.add_agent(puzzle_agent)


        software_agent = BedrockLLMAgent(
            BedrockLLMAgentOptions(
                name="Software Engineer",
                streaming=False,
                description=f"Responsible for implementing the Typescript code to calculate the puzzle answer.  Carry out \
                    puzzle implementation detailed by Puzzle Solver with the following additional details in mind: \
                        \n\n {implementation_notes}",
                model_id="us.anthropic.claude-3-5-sonnet-20241022-v2:0",
                inference_config={
                    'maxTokens': 8192,
                    'temperature': 0.0
                },
                tool_config={
                    "tool": filesystem_tool.filesystem_tools_description,
                    "toolMaxRecursion": 5,
                    "useToolHandler": filesystem_tool.file_tools_handler,
                },
                callbacks=BedrockLLMAgentCallbacks(),
                client=longer_client
            )
        )
        software_agent.set_system_prompt(
            filesystem_tool.filesystem_tools_prompt,
            {
                "ROLE": "Software Engineer",
                "ROLE_INPUT_FOLDER": "./work/02_PUZZLE_SOLUTION",
                "ROLE_OUTPUT_FOLDER": "./work/03_OUTPUT",
            }
        )
        self.orchestrator.add_agent(software_agent)


if __name__ == "__main__":
    client = UIClient()
    client.draw_ui()

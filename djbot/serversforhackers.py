from ansible.playbook import PlayBook
from ansible.inventory import Inventory
from ansible import callbacks
from ansible import utils

import jinja2
from tempfile import NamedTemporaryFile
import os

# Boilerplace callbacks for stdout/stderr and log output
utils.VERBOSITY = 0
playbook_cb = callbacks.PlaybookCallbacks(verbose=utils.VERBOSITY)
stats = callbacks.AggregateStats()
runner_cb = callbacks.PlaybookRunnerCallbacks(stats, verbose=utils.VERBOSITY)

# Dynamic Inventory
# We fake a inventory file and let Ansible load if it's a real file.
# Just don't tell Ansible that, so we don't hurt its feelings.
inventory = """
[customer]
{{ public_ip_address }}

[customer:vars]
domain={{ domain_name }}
customer_id={{ customer_id }}
customer_name={{ customer_name }}
customer_email={{ customer_email }}
"""

inventory_template = jinja2.Template(inventory)
rendered_inventory = inventory_template.render({
    'public_ip_address': '111.222.333.444',
    'domain_name': 'some.domainname.com'
        # and the rest of our variables
    })

# Create a temporary file and write the template string to it
hosts = NamedTemporaryFile(delete=False)
hosts.write(rendered_inventory)
hosts.close()

pb = PlayBook(
playbook='/path/to/main/playbook.yml',
    host_list=hosts.name,     # Our hosts, the rendered inventory file
    remote_user='some_user',
    callbacks=playbook_cb,
    runner_callbacks=runner_cb,
    stats=stats,
    private_key_file='/path/to/key.pem'
)

results = pb.run()

# Ensure on_stats callback is called
# for callback modules
playbook_cb.on_stats(pb.stats)

os.remove(hosts.name)

print results
        
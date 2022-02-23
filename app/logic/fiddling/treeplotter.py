from treeplotter.plotter import create_tree_diagram, Tree

child1 = Node(value=0.5, name=None)
child2 = Node(value=1.0, name=None)
child3 = Node(value=3.0, name="A")
root.children = {child1, child2, child3}

granchild1 = Node(value=0.5, name=None)
granchild2 = Node(value=3.0, name="B")
granchild3 = Node(value=2.0, name="C")
greatgrandchild = Node(value=1.0, name="D")

child1.add_children([granchild1, granchild2])
child2.add_child(granchild3)
granchild1.add_child(greatgrandchild)

value_path = [root.value, 4.0, 1.0, 0.5, 2.0]
root.add_path_of_children(path=value_path, final_node_name="Full path")

value_path_2 = [root.value, 1.0, 2.0, 1.0]
root.add_path_of_children(path=value_path_2, final_node_name="Testing overwrite")

tree=Tree(root=root)
create_tree_diagram(tree=tree,
					save_path = "img",
					webshot=True,
					verbose=True)
<cms:page name="�Ա�ĸӤ-ͨ��ҳͷ">
	<cms:insertLayout>
		<cms:layout id="layout-1">
			<cms:insertModule name="insertModule">
				<cms:module name="���δ��ͨ�����" id="1221tonglanimg">
					/*
					<div class="module">
						*/
						dataAccess.indexListHandler(
						<cms:control template="module-control"/>
						{"list":[
						<cms:repeat row="5" name="e44d8f9a-d300-4694-a3f0-8d73af127641">
							#if($repeatCount!=1),#end{
							<cms:custom title="��ǩ��Ϣ" name="b83f55c0-e7df-488e-9621-48ce0ba5d279" fields="tagname:��ǩ����:string,tagurl:�б��ַ:string">
								"tagName":"$!tagname",
								"listUrl":"$!listurl",
							</cms:custom>
							<cms:articleList row="30" title="��ǩ" name="9f24a887-236b-4f01-b061-484f2b6358e3">
								"items":[
								#foreach($item in $elementList)
								#if($velocityCount!=1),#end{
								"title":'$item.title2',
								"stitle":'$item.title3',
								"url":"$item.publishedUrl",
								"img":"$item.image2" 
								}
								#end]
							</cms:articleList>
							}
						</cms:repeat>
						]
					})
						/*
					</div>
					*/
				</cms:module>
			</cms:insertModule>
		</cms:layout>
	</cms:insertLayout>
</cms:page>